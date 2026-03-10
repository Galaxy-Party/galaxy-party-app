
export async function getHello() {
    const request = await fetch("http://localhost:8080/api/hello")
    if (request.ok) {
        return request.text()
    }
}