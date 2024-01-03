const fetchNews = async () => {
    const response = await fetch("https://ok.surf/api/v1/cors/news-feed");
    const data = await response.json();

    const container = document.getElementById("news-container");

    Object.keys(data).forEach(category => { // needs to iterate through each category!
        data[category].forEach(item => {
            const card = createItemCard(item);
            container.appendChild(card);
        });
    });
};

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

fetchNews();