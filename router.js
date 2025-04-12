function goToPage(page) {
    const pages = {
        home: "./AutoUI.html",
        visualizer: "./splat/index.html",
    };

    const pageUrl = pages[page];
    if (pageUrl) {
        window.location.href = pageUrl;
    } else {
        console.error("Page not found");
    }
}