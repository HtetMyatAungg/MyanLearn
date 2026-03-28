# MyanLearn

**You can speak it. Now learn to read and write it.**

An AI-powered Burmese literacy tool for diaspora speakers who grew up speaking Burmese but never master to read or write Myanmar script.

**Live app:** https://myanlearn.pages.dev

## The Problem

Millions of Myanmar diaspora kids around the world can hold a full conversation in Burmese with their family — but can't read a single word of Myanmar script. Existing tools don't help because they're built for tourists or complete beginners, not for native speakers unlocking literacy.

## The Solution

MyanLearn uses an AI tutor that knows you already speak the language. It teaches Myanmar script through the words you already use every day — showing the script, romanised pronunciation, and English meaning side by side. No "hello, my name is" lessons. Just a direct path from spoken fluency to written literacy.

## Tech Stack

- **Frontend:** React
- **Backend:** Cloudflare Workers + Workers AI (Llama 3.1)
- **Hosting:** Cloudflare Pages
- **API Repo:** [github.com/HtetMyatAungg/myanlearn-api](https://github.com/HtetMyatAungg/myanlearn-api)

## Features

- AI chat tutor that teaches Burmese script conversationally
- Shows Myanmar script, romanised pronunciation, and English meaning together
- Adapts to the student's level based on conversation
- Burmese-first approach — built for speakers, not beginners

## Run Locally

```bash
git clone https://github.com/HtetMyatAungg/myanlearn.git
cd myanlearn
npm install
npm start
```

Note: The AI features require the backend API to be running. See the [API repo](https://github.com/HtetMyatAungg/myanlearn-api) for setup.

## Why I Built This

I'm originally from Myanmar. I can speak Burmese fluently but my reading and writing is weak — I was educated in English abroad. I built MyanLearn because I couldn't find a tool designed for people like me. This is my problem, and now it's my product.

## Author

**Henry (Htet Myat Aung)** — [GitHub](https://github.com/HtetMyatAungg) · [LinkedIn](https://linkedin.com/in/htet-myat-aung-4a370932a)
