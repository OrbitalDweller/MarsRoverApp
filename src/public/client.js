let store = Immutable.Map({
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: '',
    manifest: '',
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    const newStore = store.merge(newState)
    render(root, newStore)
    return newStore
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let rovers = state.get('rovers')
    let apod = state.get('apod')
    let manifest = state.get('manifest')
    let photos = state.get('photos')


    return `
        <header></header>
        <main>
            <section>
                ${ImageOfTheDay(apod)}
            </section>

            <section>
                <div id="roverButtons">
                    ${rovers.reduce((buttons, rover) => {
                        return buttons + `<button onclick="getRoverManifest('${rover}')">${rover}</button>`
                    }, '')}
                </div>
            </section>

            <section>
                ${RoverManifest(manifest)}         
            </section>

            <section>
                ${RoverPhotos(manifest, photos)}
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

const RoverLaunchDate = (photoManifest) => {
    return photoManifest ? photoManifest.launch_date : 'unknown'
}

const RoverLandingDate = (photoManifest) => {
    return photoManifest.landing_date ? photoManifest.landing_date : 'unknown'
}

const RoverName = (photoManifest) => {
    return photoManifest.name ? photoManifest.name : 'unknown'
}

const RoverStatus = (photoManifest) => {
    return photoManifest.status ? photoManifest.status : 'unknown'
}

const RoverMaxSol = (photoManifest) => {
    return photoManifest ? photoManifest.max_sol : 'unknown'
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date().toISOString().split('T')[0];
    console.log(apod)
    if (!apod) {
        getImageOfTheDay(store)
        return '<p>Loading...</p>'
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `
    } else {
        return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `
    }
}

const RoverManifest = (manifest) => {
    if (!manifest) {
        return ''
    }
    const photoManifest = manifest.manifest.photo_manifest
    return photoManifest ? `
            <p>${RoverName(photoManifest)} rover mission is currently ${RoverStatus(photoManifest)}.</p>
            <p>${RoverName(photoManifest)} was launched on ${RoverLaunchDate(photoManifest)} 
            and landed on ${RoverLandingDate(photoManifest)}.</p>
    ` : ''
}

const RoverPhotos = (manifest, photos) => {
    if (!manifest) {
        return ''
    }
    const rover = RoverName(manifest.manifest.photo_manifest)
    const sol = RoverMaxSol(manifest.manifest.photo_manifest)
    if (!photos || rover != photos.photos.photos[0].rover.name) {
        return `<button onclick="getRoverPhotos('${rover}','${sol}')">See latest photos from ${rover}</button>`
    }
    return photos.photos.photos.reduce((images, image) => {
        return images + `<img src="${image.img_src}" height="350px" width="75%" />`
    }, '') 
}

// API calls
const getRoverManifest = (rover) => {
    fetch(`http://localhost:3000/manifest/${rover}`)
        .then(res => res.json())
        .then(manifest => {
            store = updateStore(store, { manifest })
        })
}

const getRoverPhotos = (rover, sol) => {
    fetch(`http://localhost:3000/photo/${rover}/${sol}`)
        .then(res => res.json())
        .then(photos => {
            store = updateStore(store, { photos })
        })
}

// Example API call
const getImageOfTheDay = (state) => {
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod =>  {
            store = updateStore(store, { apod })
        })
}

window.getRoverManifest = getRoverManifest;
window.getRoverPhotos = getRoverPhotos;
window.getImageOfTheDay = getImageOfTheDay;