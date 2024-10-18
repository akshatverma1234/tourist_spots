const upvote = document.getElementById("upvote")
const downvote = document.getElementById("downvote")
const score = document.getElementById("score")

const sendvote = async (votetype) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }
  if (votetype === "up") {
    options.body = JSON.stringify({
      votetype: "up",
      placeId,
    })
  } else if (votetype === "down") {
    options.body = JSON.stringify({
      votetype: "down",
      placeId,
    })
  } else {
    throw "Votetype must be 'up' or 'down'"
  }
  await fetch("/places/vote", options)
    .then((data) => {
      return data.json()
    })
    .then((res) => {
      console.log(res)
      handleVote(res.score, res.code)
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleVote = (newScore, code) => {
  score.innerText = newScore

  if (code == 0) {
    upvote.classList.remove("btn-success")
    upvote.classList.add("btn-outline-success")
    downvote.classList.remove("btn-danger")
    downvote.classList.add("btn-outline-danger")
  } else if (code === 1) {
    upvote.classList.remove("btn-outline-success")
    upvote.classList.add("btn-success")
    downvote.classList.remove("btn-danger")
    downvote.classList.add("btn-outline-danger")
  } else if (code === -1) {
    upvote.classList.remove("btn-success")
    upvote.classList.add("btn-outline-success")
    downvote.classList.remove("btn-outline-danger")
    downvote.classList.add("btn-danger")
  } else {
    console.log("Error in Voting")
  }
}

upvote.addEventListener("click", async function () {
  sendvote("up")
})
downvote.addEventListener("click", async function () {
  sendvote("down")
})
