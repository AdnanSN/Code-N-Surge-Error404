const API_KEY = "54044c12095f9f72b37e06383d2623770ee99";
const url = "https://newsdata.io/api/1/news";

window.addEventListener("load", () => fetchNews("everything"));

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}?apikey=${API_KEY}&q=${query}`);
        const data = await res.json();
        bindData(data.results);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");
    cardsContainer.style.setProperty("--count", Math.floor(articles.length / 4));
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.image_url) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");
    const card = cardClone.querySelector(".card");

    newsImg.src = article.image_url;
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = article.description || "Description not available";
    card.style.setProperty("grid-row", "span " + (Math.floor(Math.random() * 4) + 2));

    const date = new Date(article.pubDate).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newsSource.innerHTML = `${article.source_id || "Unknown Source"} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.link, "_blank");
    });
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
});
