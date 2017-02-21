let main = () => {
    // 启动按钮
    $(document).ready(function() {
        // 设置统一样式
        setStyle();

        // 在页面中插入一个执行按钮
        setBtn();

        // 点击按钮执行操作
        $('#list-btn').click(function() {
            mainTask();
        });
    });

    // 主要操作逻辑
    let mainTask = () => {
        $.when(setLoading())
            .then(() => {
                return getPages();
            })
            .done((data) => {
                setTextBox(data.links, data.names)
                removeLoading();
            })
    }

    // 设置按钮
    let setBtn = () => {

        const btnElm = `
        <tr>
            <td class="tc">获取链接:</td>
            <td><button type="button" id="list-btn">点击获取</button></td>
        </tr>
        `;

        $('#taglist').find('tbody').append(btnElm);

    }

    // 获取页面连接
    let getPages = () => {

        const pageActors = Array.from($(".ptt tr td a"))

        let pageLinks = pageActors.map((a) => {
            return a.href;
        })

        pageLinks = Array.from(new Set(pageLinks));

        let imgLinks = "";
        let imgNames = "";

        pageLinks.map((link) => {
            $.ajax({
                type: "GET",
                url: link,
                dataType: "html",
                async: false
            }).done((data) => {
                const imageActors = Array.from($(data).find(".gdtm a"));
                let imgPages = imageActors.map((a) => {
                    return a.href
                })

                const imageInfo = getImages(imgPages);

                if (imgLinks == "") {
                    imgLinks = imageInfo.links;
                    imgNames = imageInfo.names;
                } else {
                    imgLinks = imgLinks + "<br>\n" + imageInfo.links;
                    imgNames = imgNames + "<br>\n" + imageInfo.names;
                }

            }).fail((err) => {
                console.log(err)
            })
        })

        return {
            'links': imgLinks,
            'names': imgNames
        }

    }

    // 获取图片链接
    let getImages = (linkList) => {

        const imgLinks = linkList

        let links = [];
        let names = [];

        //  http://{ip}:{port}/h/{hash}-{index}-{width}-{height}-{format}/
        //  keystamp=1487076600-4cb29d1ed6;fileindex=51006747;xres=1280/001.jpg
        const pat1 = /^.*(keystamp=\w+-\w+);fileindex.*\/(.*?)\.(jpg|png)$/;

        // http://{ip}:{port}/h/{hash}-{index}-{width}-{width}-{format}/
        // keystamp=1487078400-4b8a74d97f/003.jpg
        const pat2 = /^.*(keystamp=\w+-\w+)\/(.*?)\.(jpg|png)/;

        // http://{ip}/lid|im|h/{index}/{hash}-{index}-{width}-{height}-{format}/
        // c1cc00a72d0bdd21776ffe30bff8cd64c7b504bc-559126-1111-1600-jpg/2400/uu51rws8urs/172.jpg
        const pat3 = /^.*\/(?:lid|im|h)\/.*\/(.*?)\.(jpg|png)/;

        imgLinks.map((link) => {
            $.ajax({
                type: "GET",
                url: link,
                dataType: "html",
                async: false
            }).done((data) => {
                const link = $(data).find('#img').attr('src');

                let match = '';
                let name = '';

                if (pat1.test(link)) {
                    match = pat1.exec(link);
                    //     keystamp        jpg | png          001              jpg
                    name = match[1] + '.' + match[3] + ' ' + match[2] + '.' + match[3];
                } else if (pat2.test(link)) {
                    match = pat2.exec(link);
                    //       001           jpg | png          001              jpg
                    name = match[2] + '.' + match[3] + ' ' + match[2] + '.' + match[3];
                } else if (pat3.test(link)) {
                    match = pat3.exec(link);
                    //      172           jpg | png          172              jpg
                    name = match[1] + '.' + match[2] + ' ' + match[1] + '.' + match[2];
                }

                links.push(link);
                names.push(name);
            }).fail(() => {
                link = '第 ' + (i + 1) + ' 张图出错;错误地址：' + url;
                links.push(link);
                names.push('获取失败');
            })
        });

        return {
            'links': links.length > 0 ? links.join('<br>\n') : '<h1>获取失败</h1>',
            'names': names.length > 0 ? names.join('<br>\n') : '<h1>获取失败</h1>'
        }
    }

    // 设置文本框
    let setTextBox = (list, name) => {


        if (!document.getElementById('result-box')) {
            let box = document.createElement('div');

            const html = `
                <div id="list-box"></div>
                <div id="name-box"></div>
            `;

            box.id = "result-box";
            box.innerHTML = html;
            $('#gdt').before(box);
            $('#list-box, #name-box').attr("contentEditable", true);
        }
        $('#list-box').html(list);
        $('#name-box').html(name);
    }

    const setStyle = () => {
        let style = document.createElement('style');

        const css = `
            #list-btn {
                border-radius: 5px;
                border: 1px solid #989898;
                padding: 1px 4px;
                cursor: pointer;
                color: #ddd;
                background: transparent;
                font-weight: 700
            }

            #list-btn:hover {
                color: #FFFBDB;
            }
            
            #result-box {
                min-width: 732px;
                max-width: 1212px;
                margin: 0 auto 5px auto;
                display:flex;
            }

            @media screen and (max-width: 1230px) {
                div#result-box {
                    max-width: 972px;
                }
            }

            @media screen and (max-width: 990px) {
                div#result-box {
                    max-width: 732px;
                }
            }

            #result-box > div {
                border: 1px solid #000;
                padding: 5px;
                background: #4f535b;
                text-align: center;
                box-sizing: border-box;
                width: calc(50% - 6px);
                flex-grow: 0;
                flex-shrink: 0;
            }

            #result-box > div:first-child {
                margin-right: 12px;
            }

            /* loading animation */

            .sk-fading-circle {
                margin: 100px auto;
                width: 40px;
                height: 40px;
                position: relative;
            }

            .sk-fading-circle .sk-circle {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
            }

            .sk-fading-circle .sk-circle:before {
                content: '';
                display: block;
                margin: 0 auto;
                width: 15%;
                height: 15%;
                background-color: #ccc; /* 圆圈颜色 */
                border-radius: 100%;
                -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
                        animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
            }

            .sk-fading-circle .sk-circle2 {
                -webkit-transform: rotate(30deg);
                    -ms-transform: rotate(30deg);
                        transform: rotate(30deg);
            }

            .sk-fading-circle .sk-circle3 {
                -webkit-transform: rotate(60deg);
                    -ms-transform: rotate(60deg);
                        transform: rotate(60deg);
            }

            .sk-fading-circle .sk-circle4 {
                -webkit-transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                        transform: rotate(90deg);
            }
            .sk-fading-circle .sk-circle5 {
                -webkit-transform: rotate(120deg);
                    -ms-transform: rotate(120deg);
                        transform: rotate(120deg);
            }
            .sk-fading-circle .sk-circle6 {
            -webkit-transform: rotate(150deg);
                -ms-transform: rotate(150deg);
                    transform: rotate(150deg);
            }
            .sk-fading-circle .sk-circle7 {
            -webkit-transform: rotate(180deg);
                -ms-transform: rotate(180deg);
                    transform: rotate(180deg);
            }
            .sk-fading-circle .sk-circle8 {
            -webkit-transform: rotate(210deg);
                -ms-transform: rotate(210deg);
                    transform: rotate(210deg);
            }
            .sk-fading-circle .sk-circle9 {
            -webkit-transform: rotate(240deg);
                -ms-transform: rotate(240deg);
                    transform: rotate(240deg);
            }
            .sk-fading-circle .sk-circle10 {
            -webkit-transform: rotate(270deg);
                -ms-transform: rotate(270deg);
                    transform: rotate(270deg);
            }
            .sk-fading-circle .sk-circle11 {
            -webkit-transform: rotate(300deg);
                -ms-transform: rotate(300deg);
                    transform: rotate(300deg); 
            }
            .sk-fading-circle .sk-circle12 {
            -webkit-transform: rotate(330deg);
                -ms-transform: rotate(330deg);
                    transform: rotate(330deg); 
            }
            .sk-fading-circle .sk-circle2:before {
            -webkit-animation-delay: -1.1s;
                    animation-delay: -1.1s; 
            }
            .sk-fading-circle .sk-circle3:before {
            -webkit-animation-delay: -1s;
                    animation-delay: -1s; 
            }
            .sk-fading-circle .sk-circle4:before {
            -webkit-animation-delay: -0.9s;
                    animation-delay: -0.9s; 
            }
            .sk-fading-circle .sk-circle5:before {
            -webkit-animation-delay: -0.8s;
                    animation-delay: -0.8s; 
            }
            .sk-fading-circle .sk-circle6:before {
            -webkit-animation-delay: -0.7s;
                    animation-delay: -0.7s; 
            }
            .sk-fading-circle .sk-circle7:before {
            -webkit-animation-delay: -0.6s;
                    animation-delay: -0.6s; 
            }
            .sk-fading-circle .sk-circle8:before {
            -webkit-animation-delay: -0.5s;
                    animation-delay: -0.5s; 
            }
            .sk-fading-circle .sk-circle9:before {
            -webkit-animation-delay: -0.4s;
                    animation-delay: -0.4s;
            }
            .sk-fading-circle .sk-circle10:before {
            -webkit-animation-delay: -0.3s;
                    animation-delay: -0.3s;
            }
            .sk-fading-circle .sk-circle11:before {
            -webkit-animation-delay: -0.2s;
                    animation-delay: -0.2s;
            }
            .sk-fading-circle .sk-circle12:before {
            -webkit-animation-delay: -0.1s;
                    animation-delay: -0.1s;
            }

            @-webkit-keyframes sk-circleFadeDelay {
            0%, 39%, 100% { opacity: 0; }
            40% { opacity: 1; }
            }

            @keyframes sk-circleFadeDelay {
            0%, 39%, 100% { opacity: 0; }
            40% { opacity: 1; } 
            }
        `;

        style.innerHTML = css;

        document.body.appendChild(style);
    }

    const loading = () => {
        // source: http://tobiasahlin.com/spinkit/
        const html = `
        <div id="ex-loading" class="sk-fading-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        </div>
        `;

        return html;
    }

    const setLoading = () => {
        $('#gdt').before(loading())
    }

    const removeLoading = () => {
        $('#ex-loading').remove()
    }
}