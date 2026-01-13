type QueryExample = {
    imagePath: string,
    searchQuery: string,
    artist: string
};

const hamburger   = document.getElementById("hamburger") as HTMLImageElement;
const mainHeading = document.getElementById("main-heading") as HTMLHeadingElement;
const mobileMenu  = document.getElementsByClassName("mobile-nav")[0] as HTMLMenuElement;
const pageHeader  = document.getElementsByTagName("header")[0] as HTMLElement;
const tagCloud    = document.getElementById("tag-cloud") as HTMLDivElement;
const themeTagBin = document.getElementById("tag-bin") as HTMLDivElement;
const themeTags   = document.getElementsByClassName("theme-tag") as HTMLCollectionOf<HTMLDivElement>;

// this array is in reverse order of the nodes in the document.
var allDisplays    = new Array<HTMLDivElement>();
var visibleDisplay = 0;

// setting this here vs. CSS files so it can be consistently applied
const animationDur = 1000;
const timeVisible  = 4000;


function hideNode(this: HTMLDivElement, ev: AnimationEvent) {
    if (ev.animationName == "fade-out") {
        this.style.display  = "none";
        this.style.position = "absolute";
    } 

    if (ev.animationName == "fade-in") {
        this.style.position = "static";
    }
}


// Mom: we have a framework at home!
// The framework at home:
function constructClone(idx: number, exampleQuery: QueryExample): HTMLDivElement {
    
    const newExampleRaw = 
        `<div class="example-display">
            <div id="example-caption">
                <p id="example-search">${exampleQuery.searchQuery}</p>
                <p id="example-artist">by: ${exampleQuery.artist}</p>
            </div>
        </div>`

    const parser = new DOMParser();
    const parsed = parser.parseFromString(newExampleRaw, "text/html");

    let newExample = parsed.body.firstChild as HTMLDivElement;

    newExample.addEventListener("animationend", hideNode);
    newExample.classList.add("example-display");
    
    newExample.style.position          = "absolute";
    newExample.style.backgroundImage   = `url("${exampleQuery.imagePath}")`;
    newExample.style.animationDuration = animationDur + "ms";

    return newExample;
}


function insertExampleDisplays(exampleQueries: QueryExample[]) {

    var lastElement  = null;

    for (const [i, exq] of exampleQueries.entries()) {

        let newExample = constructClone(i, exq);

        if (lastElement) {
            lastElement.before(newExample);
        } else {
            newExample.style.position = "static";
            newExample.style.display  = "flex";
            mainHeading.before(newExample);
        }

        allDisplays.push(newExample);
        lastElement = newExample;
    }
}


function transitionImages(outgoing: HTMLDivElement, incoming: HTMLDivElement, wrapping: boolean) {

    outgoing.style.animationName = "fade-out";
    outgoing.style.position      = "static";
 
    incoming.style.animationName = "fade-in";
    incoming.style.display       = "flex";

    // when `incoming` is not the sibling directly before `outgoing`,
    // "absolute" places it *below* `outgoing`. But since `incoming`
    // is absolutely positioned, we can manually correct for this by
    // setting the exact position for it.
    if (wrapping) {
        incoming.style.top = pageHeader
            .getBoundingClientRect()
            .bottom + "px";
    }
}


// places most recently used at the "back" (furthest-positioned) 
// part of the div set
function rotateImages() {
    const outgoingDisplay = visibleDisplay;
    visibleDisplay        = (visibleDisplay + 1) % allDisplays.length;

    transitionImages(
        allDisplays[outgoingDisplay], 
        allDisplays[visibleDisplay],
        outgoingDisplay > visibleDisplay
    );
}

function rotatePlaceholder(qlist: QueryExample[]) {
    
    const searchBox   = document.getElementById("search-box") as HTMLInputElement;
    
    // don't animate when user has typed in box
    if (searchBox.value) {
        return;
    }

    let fadeOut = searchBox.animate(
        [
            { color: "var(--body-text-color)" },
            { color: "#fff" }
        ],
        animationDur / 2
    );

    // only switch out text and start fade-in once fade-out
    // is guaranteed done
    fadeOut.onfinish = () => {
        searchBox.placeholder = qlist[visibleDisplay].searchQuery
        searchBox.animate(
            [
                { color: "#fff" },
                { color: "var(--body-text-color)" }
            ],
            animationDur / 2
        );
    };
    
}


function toggleTagBin(this: HTMLDivElement, _: PointerEvent) {
    if (this.parentElement?.id === "tag-cloud") {
        themeTagBin.appendChild(this);
    }
    else if (this.parentElement?.id === "tag-bin") {
        tagCloud.appendChild(this);
    }
}

function toggleMenu(this: HTMLImageElement, _ev: PointerEvent) {
    const classes    = mobileMenu.classList
    
    if (!classes.contains("expand") || !classes) {
        mobileMenu.classList.add("expand");
    }

    else if (classes.contains("expand")) {
        mobileMenu.classList.remove("expand");
    }
}


function main() {

    for (var tag of themeTags) {
        tag.addEventListener("click", toggleTagBin)
    }

    hamburger.addEventListener("click", toggleMenu)

    fetch("./search-examples.json")
        .then((resp: Response) => {
            if (!resp.ok) { 
                throw new Error(`HTTP error returned: ${resp.status}`) 
            } 
            return resp;
        })
        .then((resp: Response) => resp.json())
        .then((qlist: QueryExample[]) => {
            insertExampleDisplays(qlist);
            window.setInterval(rotateImages,      timeVisible);
            window.setInterval(rotatePlaceholder, timeVisible, qlist);
        })
        .catch((err) => console.error(err));
}

main()
