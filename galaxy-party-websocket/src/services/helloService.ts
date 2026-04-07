
export async function getHello() {
    const request = await fetch(`${process.env.API_URL}/api/hello`)
    if (request.ok) {
        return request.text()
    }
}