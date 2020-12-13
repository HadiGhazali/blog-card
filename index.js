function getPosts(url) {
    let promise = new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: 'https://jsonplaceholder.ir/posts',
            success: function (response) {
                resolve(response)
            },
            fail: function () {
                reject('error')
            }
        })
    })
    return promise
}

function getUsers(url) {
    let promise = new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: 'https://jsonplaceholder.ir/users',
            success: function (response) {
                resolve(response)
            },
            fail: function () {
                reject('error')
            }
        })
    })
    return promise
}


function getComments(url) {
    let promise = new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: 'https://jsonplaceholder.ir/comments',
            success: function (response) {
                // console.log(response)
                resolve(response)
            },
            fail: function () {
                reject('error')
            }
        })
    })
    return promise
}

let obj = {
    user: {
        name: '',
        email: '',
        avatar: ''
    },
    id: '',
    title: '',
    body: '',
    comments: []
}

let objs = []

function fetchAll() {
    return new Promise(function (resolve, reject) {
        getPosts().then((postData) => {
            getUsers().then((userData) => {
                getComments().then((commentData) => {
                    resolve({postData, userData, commentData});
                    // console.log(item)
                    // console.log(postComments)
                }).catch(() => {
                    console.log('comments error')
                    reject()
                })
            }).catch(() => {
                console.log('User error')
                reject()
            })
        }).catch(() => {
            console.log('post error')
            reject()
        })
    })
}

// console.log(getPosts())
// console.log(getUsers())
function aggregateData() {
    let aggregatedData = []
    return new Promise(function (resolve, reject) {
        fetchAll()
            .then((data) => {
                data.postData.map((item) => {
                    aggregatedData.push({
                        userInformation: data.userData.filter((user) =>
                            user.id === item.userId
                        ).map((item) => {
                            return {
                                name: item.name,
                                avatar: item.avatar,
                                email: item.email
                            }
                        })[0],
                        comments: data.commentData.filter((comment) => {
                            return comment.postId === item.id
                        }).map((item) => {
                            return {
                                name: item.name,
                                text: item.body
                            }
                        }),
                        ...item
                    })
                })
                aggregatedData.length === data.postData.length && resolve(aggregatedData);
            })
            .catch(() => {
                console.log('aggregation error')
                reject()
            })
    })
}

let index = 0

function addToCard(post) {
    let comment;
    let CommentList = ''
    for (comment of post.comments) {
        CommentList += (`<li class="list-group-item disabled">${comment.name}<br>${comment.text}</li>`)
    }
    let i = Math.floor((Math.random() * 4) + 1);
    let add = `<div class="col-3">

        <div class="card m-2 p-2 row color${i}" style="height: inherit">
            <div class="h-50 col-3 align-self-end">
                <img src="${post.userInformation.avatar}" alt="not avatar" class="img-thumbnail">
            </div>
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${post.userInformation.name}</h6>
                <p class="card-text">${post.body}</p>
                <a href="#" class="card-link">${post.userInformation.email}</a>
                <a href="#" class="card-link">Another link</a>
                <div dir="ltr"><button id="button${index}" type="button" class="btn btn-outline-dark"><i class="fas fa-list-ul"></i></button>
                <div id="comment${index}" style="display: none;%" dir="rtl" class="m-2"><ul class="m-0 p-0 rounded overflow-auto">${CommentList}</ul></div>
                
                </div>
                
            </div>
        </div>
    </div>`
    $('#posts').append(add)

    index += 1
}

function main() {
    aggregateData().then((data) => {
        data.map((item) => {
            addToCard(item)
        })
        let n = data.length
        for (let i = 0; i < n; i++) {
            let j = 0
            $(`#button${i}`).click(function (e) {
                e.preventDefault()
                if (j % 2 === 0) {
                    $(`#comment${i}`).css('display', 'block')
                    j += 1
                } else {
                    $(`#comment${i}`).css('display', 'none')
                    j += 1
                }
            })
        }
    }).catch(() => {
        console.log('error')
    })
}

main()
// function main2(){
//     return new Promise(function (resolve, reject) {
//         main()
//
//         reject()
//     })
// }
// main2().then().catch(()=>{
//     console.log('error')
// })
