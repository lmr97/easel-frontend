export type TagResponse = {
    accessed: Date,
    tags: Array<string>
}

export type TagDisplaySettings = {
    selected: boolean,
    colorNumber: number
}

export type QueryExample = {
    imagePath: string, 
    searchTags: string[],
    searchString: string,
    artist: string
};