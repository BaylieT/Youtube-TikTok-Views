const ideas = {
    youtube: [
        "How-to tutorials for trending topics",
        "Reacting to viral videos",
        "Day-in-the-life vlogs",
        "Unboxing and review videos",
        "Top 5 lists in your niche",
        "Collab with another YouTuber",
        "Challenge videos",
        "Behind-the-scenes of your creative process",
        "Create a viral meme format",
        "Host a big giveaway or contest",
        "Interview celebrities or experts",
        "Make a parody of a popular video",
        "Share your biggest failures and lessons",
        "Do a 24-hour challenge",
        "Start a unique series with cliffhangers",
        "Document a transformation journey",
        "Make a video with crazy special effects"
    ],
    tiktok: [
        "Dance to a trending sound",
        "Quick life hacks",
        "Funny skits or memes",
        "Duet with a popular creator",
        "Transformation or glow-up videos",
        "Pet or animal content",
        "Try a viral challenge",
        "Share a personal story in 30 seconds",
        "Create a new challenge and tag others",
        "Use green screen for creative effects",
        "Show a mind-blowing magic trick",
        "Make a video with a surprise ending",
        "Collaborate with TikTok stars",
        "Do a public prank (be safe and respectful)",
        "Share your secret talent",
        "Make a video that starts a trend"
    ]
};

function showIdeas(platform) {
    const el = document.getElementById(platform + '-ideas');
    el.innerHTML = '<ul>' + ideas[platform].map(i => `<li>${i}</li>`).join('') + '</ul>';
}
