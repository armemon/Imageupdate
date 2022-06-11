var dict = {}
var urls = [];
const getFromFirebase = () => {
    storageRef.listAll().then(function (res) {
        res.items.forEach((imageRef) => {
            imageRef.getDownloadURL().then((url) => {
                imageRef.getMetadata()
                    .then((metadata) => {
                        var date = new Date(metadata.updated); // some mock date
                        var milli = date.getTime();

                        dict[url] = milli
                    })


                    .catch((error) => {
                        // Uh-oh, an error occurred!
                    });
            });
        });
    })
        .catch(function (error) {
            console.log(error);
        });
};

getFromFirebase()
const render = () => {
    urls = Object.keys(dict).sort(function (a, b) { return dict[b] - dict[a] })
    var photos = document.getElementById("photos")
    if (urls[0]) {
        photos.innerHTML = ""
        urls.forEach((key) => {
            const img = document.createElement("img");
            const imgwraps = document.createElement("div");
            const closes = document.createElement("button");
            closes.innerHTML = 'x'
            img.setAttribute("src", key);
            imgwraps.setAttribute("class", "img-wraps");
            closes.setAttribute("class", "closes");
            closes.setAttribute("onclick", "deleted(this)");
            imgwraps.appendChild(img)
            imgwraps.appendChild(closes)
            photos.appendChild(imgwraps)
        })
    }
}

setInterval(render, 1000)
setInterval(getFromFirebase, 20000)
function deleted(e) {
    console.log(dict)
    url = e.parentNode.childNodes[0].src
    let pictureRef = firebase.storage().refFromURL(url);
    pictureRef.delete()

    delete dict[url]
    deletingInterval = setInterval(delete dict[url], 1000)
    setTimeout(clearInterval(deletingInterval),21000)
    urls = urls.filter(item => item !== url)
    e.parentNode.remove()
    console.log(dict)
    console.log(urls)
}