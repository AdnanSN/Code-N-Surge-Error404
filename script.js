const API_KEY = "ff689b33fe4a470bbd9447846fe1c1b2";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("Everything"));

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");    
    const newsCardTemplate = document.getElementById("template-news-card");
    cardsContainer.style.setProperty("--count",Math.floor(articles.length / 4))
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    })
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");
    const card = cardClone.querySelector(".card");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description}`;
    card.style.setProperty("grid-row","span "+(Math.floor( Math.random() * 4 ) + 2));
    // card.style.setProperty("grid-column","span " +(Math.floor( Math.random() * 5 ) +1));

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
})
