const form = document.getElementById('form');
const search = document.getElementById('search-input');
const button = document.getElementById('search-btn');
const container = document.querySelector('.container');


const getShows = async (searchQuery) => {
    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchQuery}`);

        return response.data;

    } catch (error) {
        console.error(error)
    }
}

const getPoster = (data) => {
    let {show:{image}} = data;
    const posterHref = !image ? 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' : image.medium;

    return posterHref;
}

const getTitle = (data) => {
    const title = data.show.name;

    return title;
}

const getTitleLink = (data) => {
    let {show:{officialSite, network}} = data;
    let href;

    if (!officialSite && !network) {
        href = '#';
    } else {
        href = officialSite || network.officialSite;
    }

    return href;
}     

const getYear = (data) => {
    const year = !data.show.premiered ? 'unknown' : data.show.premiered.slice(0, 4);

    return year;
}



search.addEventListener('input', async function() {
    const titleList = document.querySelectorAll('#movie-title');

    for (const title of titleList) {
        title.parentElement.remove()
    }
    
    const input = this.value;

    const showsData = await getShows(input);

    for (const sub of showsData) {
        const newShow = document.createElement('div');
        newShow.classList.add('movie');

        const poster = document.createElement('img');
        poster.setAttribute('src', getPoster(sub))
        poster.setAttribute('alt', `${getTitle(sub)}-img`);

        const title = document.createElement('a');
        title.setAttribute('id', 'movie-title');
        title.setAttribute('href', getTitleLink(sub));
        title.textContent = getTitle(sub);

        const year = document.createElement('p');
        year.setAttribute('id', 'movie-year');
        year.textContent = getYear(sub);

        newShow.append(poster, title, year);
        container.append(newShow);

    }

})