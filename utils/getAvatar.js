function getAvatar(userId, size) {
    const yandexAvatarUrl = 'https://avatars.yandex.net/get-yapic'
    return `${yandexAvatarUrl}/${userId}/${size}`
}

export default getAvatar

// islands-small — 28×28 пикселей.
// islands-34 — 34×34 пикселей.
// islands-middle — 42×42 пикселей.
// islands-50 — 50×50 пикселей.
// islands-retina-small — 56×56 пикселей.
// islands-68 — 68×68 пикселей.
// islands-75 — 75×75 пикселей.
// islands-retina-middle — 84×84 пикселей.
// islands-retina-50 — 100×100 пикселей.
// islands-200 — 200×200 пикселей.