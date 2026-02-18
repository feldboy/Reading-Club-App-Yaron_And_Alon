import axios from 'axios';

async function testImageQuality() {
    try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=harry+potter&maxResults=1');
        const book = response.data.items[0];
        const thumbnail = book.volumeInfo.imageLinks.thumbnail;

        console.log('Original Thumbnail:', thumbnail);

        // Try modifying the URL
        // Remove &zoom=1
        const noZoom = thumbnail.replace('&zoom=1', '');
        console.log('No Zoom:', noZoom);

        // Add &fife=w800
        // Note: The URL might already have query params, so we append via &
        const highRes = thumbnail.replace('&zoom=1', '') + '&fife=w800';
        console.log('High Res Candidate:', highRes);

    } catch (error) {
        console.error(error);
    }
}

testImageQuality();
