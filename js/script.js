let data; // Declare data variable globally
let newsDataByCategory = {}; // this is now global scope instead

const makeElements = (type, parameters) => { // creates an element with the given parameters
    const element = document.createElement(type);
    Object.entries(parameters).forEach(([propertyKey, propertyValue]) => {
        element[propertyKey] = propertyValue;
    });
    return element;
};

const createItemCard = (item) => { // creates a card for the given item
    const card = makeElements("div", { className: "item-card" });
    const link = makeElements("a", { href: item.link, className: "news-link" });
    const image = makeElements("img", { src: item.og || "./media/no-img.png", alt: item.title || "News Image", className: "news-image" });
    const title = makeElements("p", { textContent: item.title, className: "news-title" });

    link.appendChild(image);
    link.appendChild(title);
    card.appendChild(link);

    return card;
};

const fetchNews = async () => {
    const response = await fetch("https://ok.surf/api/v1/cors/news-feed");
    data = await response.json();
    console.log(data);

    Object.keys(data).forEach((category) => {
        newsDataByCategory[category.toLowerCase()] = data[category];
    });
    
    const container = document.getElementById("news-container");

    Object.keys(data).forEach(category => { // needs to iterate through each category!
        data[category].forEach(item => {
            const card = createItemCard(item);
            container.appendChild(card);
        });
    });

    const searchInput = document.getElementById("search-input");
            searchInput.addEventListener("input", debounce(() => filterNews(searchInput.value), 300));                  
};

const filterNews = (searchTerm) => {
    const container = document.getElementById("news-container");
    container.innerHTML = "";

    Object.keys(data).forEach(category => {
        data[category].forEach(item => {
            if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                const card = createItemCard(item);
                container.appendChild(card);
            }
        });
    });
};

const debounce = (func, delay) => {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

const navMenu = document.getElementById("nav-Menu");

const categories = [ // Manually create buttons for each category
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
    "us",
    "world",
];

categories.forEach((category) => {
const button = makeElements("button", {
    type: "button",
    textContent: category,
});

button.addEventListener("click", () => {
    const container = document.getElementById("news-container");
    displayNewsByCategory(category, container);
});

navMenu.appendChild(button);
});

const displayNewsByCategory = (category, container) => {
    
    const lowerCaseCategory = category.toLowerCase(); // Convert category to lowercase for consistency
    
    if (
    newsDataByCategory[lowerCaseCategory] && // Check if data for the specified category is available
    newsDataByCategory[lowerCaseCategory].length > 0
    ) {
      container.innerHTML = ""; // Clear the existing content
      newsDataByCategory[lowerCaseCategory].forEach((item) => { // Iterate over the data for the specified category
        const card = createItemCard(item);
        container.appendChild(card);
    });
    }
};


fetchNews();