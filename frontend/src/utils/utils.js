
export const formatUploaded = (createdAt) => {
    const date = createdAt.split('T')[0]
    const dateArray = date.split('-')
    return dateArray.toReversed().join('/')
}


export const formatSecsToMins = (duration) => {
    const mins = Math.floor(duration / 60)
    const secs = duration % 60
    return `${mins}:${secs}`
}


export const formatTime = (seconds) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')
