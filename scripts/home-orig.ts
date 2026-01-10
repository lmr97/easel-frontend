type QueryExample = {
    imagePath: string,
    searchQuery: string,
    artist: string
};

var searchBox      = document.getElementById("search-box") as HTMLInputElement;
var tagCloud       = document.getElementById("tag-cloud") as HTMLDivElement;
var themeTagBin    = document.getElementById("tag-bin") as HTMLDivElement;
var hamburger      = document.getElementById("hamburger") as HTMLImageElement;
var exampleDisplay = document.getElementsByClassName("example-display")[0] as HTMLDivElement;
var mobileMenu     = document.getElementsByClassName("mobile-nav")[0] as HTMLMenuElement;
var themeTags      = document.getElementsByClassName("theme-tag") as HTMLCollectionOf<HTMLDivElement>;

// this array is in reverse order of the nodes in the document.
var allDisplays    = new Array<HTMLDivElement>(exampleDisplay);
var i: number      = 0;


// fetch("./search-examples.json")
//     .then((resp: Response) => {
//         if (!resp.ok) { 
//             throw new Error(`HTTP error returned: ${resp.status}`) 
//         } 
//         return resp;
//     })
//     .then((resp: Response) => resp.json())
//     .then(switchOutExampleInfoRepeat)
//     .catch((err) => console.error(err));

function insertExampleDisplays(exampleQueries: QueryExample[]) {

    var lastElement  = null;

    for (const [i, exq] of exampleQueries.entries()) {

        let newExample = exampleDisplay.cloneNode(true) as HTMLDivElement;
        
        newExample.classList.add("fade-in");

        newExample.style.backgroundImage = `url("${exq.imagePath}")`;
        newExample.style.zIndex          = (i * -1).toString();

        let caption = newExample.children[0];
        caption.children[0].textContent = exq.searchQuery;
        caption.children[1].textContent = "by: " + exq.artist;

        if (lastElement) {
            lastElement.before(newExample);
        } else {
            exampleDisplay.before(newExample);
        }

        allDisplays.push(newExample);
        lastElement = newExample;
    }
}

function fadeOutElement(el: HTMLDivElement) {
    el.style.display = "none";
}

function fadeinElement(el: HTMLDivElement) {
    el.style.display = "flex";
}

function slideImagesOver() {}

// places most recently used at the "back" (furthest-positioned) 
// part of the div set
function rotateImages() {

}


function switchOutExampleInfoRepeat(exampleQueries: QueryExample[]) {
    const urlFnStrings = exampleQueries.map(
        (ex: QueryExample) => `url("../${ex.imagePath}")`
    );

    window.setInterval(
        switchOutExampleInfo, 
        2000, 
        [exampleQueries, urlFnStrings]
    );
}

function switchOutExampleInfo(exampleQueries: QueryExample[], urlFnStrings: string[]) {

    const topTwoImgs = urlFnStrings.slice(0,2);
    exampleDisplay.style.backgroundImage = topTwoImgs.join(", ");
    console.log(urlFnStrings);
}


// like pop() for an Array, but with a circular queue: popped item
// is replaced into the list, at the end.
function rotateList(list: Array<any>): Array<any> {
    const top = list[0];
    list.push(top);
    const rotated = list.slice(1)

    return rotated;
}

function switchOutPlaceholder() {

    var exampleQuery: QueryExample;

    fetch(`./search-examples/example${i}.json`)
        .then((resp: Response) => {
            if (!resp.ok) { 
                throw new Error(`HTTP error returned: ${resp.status}`) 
            } 
            return resp;
        })
        .then((resp: Response) => {
            try { return resp.json(); }
            catch (e) {
                throw new Error(`Invalid JSON. Body received: ${resp.body}`)
            }
        })
        .then((jsonBody) => {
            exampleQuery = jsonBody;

            exampleDisplay.style.backgroundImage = `url(../${exampleQuery.imagePath})`;

            // delay caption and placeholder change until transition completes
            setTimeout(() => {
                searchBox.placeholder = exampleQuery.searchQuery;

                var exampleCaption = exampleDisplay.children[0];
                exampleCaption.children[0].textContent = exampleQuery.searchQuery;
                exampleCaption.children[1].textContent = "by: " + exampleQuery.artist;
            }, 1500);
        })
        .catch((err) => console.error(err));
    
    // rotate through the three examples in the 
    // search-examples local directory
    i = (i + 1) % 3;
}

function switchOutPlaceholder2() {

    var exampleQuery: QueryExample;
    
    exampleDisplay.classList.add("new-image");
    exampleDisplay.classList.remove("old-image");
    
    var newExample = exampleDisplay.cloneNode(true) as HTMLDivElement;

    fetch("./search-examples.json")
        .then((resp: Response) => {
            if (!resp.ok) { 
                throw new Error(`HTTP error returned: ${resp.status}`) 
            } 
            return resp;
        })
        .then((resp: Response) => {
            try { return resp.json(); }
            catch (e) {
                throw new Error(`Invalid JSON. Body received: ${resp.body}`)
            }
        })
        .then((jsonBody) => {
            exampleQuery = jsonBody;
            searchBox.placeholder = exampleQuery.searchQuery;

            newExample.style.backgroundImage = `url(../${exampleQuery.imagePath})`;

            var newExampleCaption = newExample.children[0];
            newExampleCaption.children[0].textContent = exampleQuery.searchQuery;
            newExampleCaption.children[1].textContent = "by: " + exampleQuery.artist;

            newExample.style.opacity = "0";
            newExample.style.position = "absolute";
            newExample.classList.remove("old-image");
            newExample.classList.add("new-image");
            exampleDisplay.insertAdjacentElement("beforebegin", newExample)

            // setTimeout(() => exampleDisplay.remove(), 5000);
        })
        .catch((err) => console.error(err));
    
    // rotate through the three examples in the 
    // search-examples local directory
    i = (i + 1) % 3;
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

for (var tag of themeTags) {
    tag.addEventListener("click", toggleTagBin)
}

hamburger.addEventListener("click", toggleMenu)

// window.setInterval(switchOutPlaceholder, 3000)