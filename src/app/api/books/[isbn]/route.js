import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        // 1. Get ISBN
        const { isbn } = await params;

        // 2. Remove hyphens and spaces
        const cleanISBN = isbn.replace(/[-\s]/g, "");

        // 3. Validate ISBN
        const isValidISBN =
            /^\d{10}$/.test(cleanISBN) ||
            /^\d{13}$/.test(cleanISBN) ||
            /^\d{9}[\dX]$/i.test(cleanISBN);

        if (!isValidISBN) {
            return NextResponse.json(
                { success: false, error: "Invalid ISBN format" },
                { status: 400 }
            );
        }

        // 4. Fetch book from Google Books
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(cleanISBN)}`
        );

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: "Google Books service unavailable" },
                { status: 502 }
            );
        }

        const result = await response.json();

        if (!result.items || result.items.length === 0) {
            return NextResponse.json(
                { success: false, error: "Book not found" },
                { status: 404 }
            );
        }

        // 5. Extract book details
        const book = result.items[0].volumeInfo;

        return NextResponse.json({
            success: true,
            data: {
                title: book.title || null,
                authors: book.authors || [],
                publisher: book.publisher || null,
                published_date: book.publishedDate || null,
                description: book.description || null,
                thumbnail: book.imageLinks?.thumbnail || null,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}