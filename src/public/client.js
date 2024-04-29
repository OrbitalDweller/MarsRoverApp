let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    images: '',
    manifest: '',
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod, manifest, images } = state

    return `
        <header></header>
        <main>
            <section>
                ${ImageOfTheDay(apod)}
            </section>

            <section>
                <div id="froverButtons">
                    ${rovers.reduce((buttons, rover) => {
                        return buttons + `<button onclick="getRoverManifest('${rover}')">${rover}</button>`
                    }, '')}
                </div>
            </section>

            <section>
                ${RoverManifest(manifest)}         
            </section>

        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

const RoverLaunchDate = (photoManifest) => {
    if (photoManifest) {
        return photoManifest.launch_date
    }
    return 'unknown'
}

const RoverLandingDate = (photoManifest) => {
    if (photoManifest.landing_date) {
        return photoManifest.landing_date
    }
    return 'unknown'
}

const RoverName = (photoManifest) => {
    if (photoManifest.name) {
        return photoManifest.name
    }
    return 'unknown'
}

const RoverStatus = (photoManifest) => {
    if (photoManifest.status) {
        return photoManifest.status
    }
    return 'unknown'
}


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

const RoverManifest = (manifest) => {
    if (!manifest) {
        return ''
    }
    const photoManifest = manifest.manifest.photo_manifest
    if (photoManifest) {
    return (`
            <p>${RoverName(photoManifest)} rover mission is currently ${RoverStatus(photoManifest)}.</p>
            <p>${RoverName(photoManifest)} was launched on ${RoverLaunchDate(photoManifest)} 
            and landed on ${RoverLandingDate(photoManifest)}.</p>
        `)
    }
}

// API calls
const getLatestRoverImages = (state) => {
    let { latest_images } = state;

    fetch(`http://localHost:3000/latest_photos/curiosity`)
        .then(res => res.json())
        .then(latest_images => updateStore(store, { latest_images }))
}

const getRoverManifest = (rover) => {
    fetch(`http://localHost:3000/manifest/${rover}`)
        .then(res => res.json())
        .then(manifest =>updateStore(store, { manifest }))
}

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}
