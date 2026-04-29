import { tweetsData as td} from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// localStorage.clear()

let tweetsData = []

if(localStorage.getItem('tweetsData')){
    tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
}
else{
    tweetsData = td
}





//1) add the ability to reply to a particular tweet \/\/\/\/\/ -- > done this on own
//2) save tweets, likes, and retweets in localStorage \/\/\/\/\/ --> done this on own
//3) allow a user to delete a tweet

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replybtn){
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
    else if(e.target.dataset.closebtn){
        handleCloseBtnClick(e.target.dataset.closebtn)
    }
})

function saveTweets(tweetsData){
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
}

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveTweets(tweetsData)
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveTweets(tweetsData)
    render()
}

function handleReplyClick(replyId) {
    const targetTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]

    targetTweet.isReplyBoxOpen = !targetTweet.isReplyBoxOpen
    saveTweets(tweetsData)
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        saveTweets(tweetsData)
        render()
        tweetInput.value = ''
    }

}

function handleReplyBtnClick(replyId) {
    const replyInput = document.getElementById(`reply-input-${replyId}`)
    // console.log("Reply btn clicked with id = " + replyId, "input = " + replyInput.value)

    const targetTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]


    if(replyInput.value){
        targetTweet.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value
        })
    }

    saveTweets(tweetsData)

    render()
    replyInput.value = ''
}

function handleCloseBtnClick(tweetId){
    // console.log("Close btn clicked with uuid = " + tweetId)
    tweetsData = tweetsData.filter(function(tweet){
        return tweet.uuid !== tweetId
    })

    saveTweets(tweetsData)
    render()
}

function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }

        let hiddenClass = 'hidden'

        if(tweet.isReplyBoxOpen){
            hiddenClass = ''
        }


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>
        </div> 
        <p class="close-btn" data-closebtn="${tweet.uuid}">X</p>  
    </div>     
</div>   

    <div class="${hiddenClass}" id="replies-${tweet.uuid}">
        <div class="reply-input-area">
            <img src="images/scrimbalogo.png" class="reply-profile-pic">
            <textarea placeholder="Add a Reply!" id="reply-input-${tweet.uuid}" class="reply-input"></textarea>
        </div>
        <button class="reply-btn" id="reply-btn-${tweet.uuid}" data-replybtn="${tweet.uuid}">Reply</button>
        ${repliesHtml}
    </div>   
</div>
`
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

