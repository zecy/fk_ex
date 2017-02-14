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

        $.when(setTextBox(loading()))
            .then(() => {
                // 1. 获取链接
                return getImgLinks();
            }).then((r) => {
                // 2. 正文文字插入到一个 div 中，等待复制
                setTextBox(r);
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

    // 获取链接
    let getImgLinks = () => {

        const pageA = $('.gdtm').find('a');

        let links = [];

        for (let i = 0; i < pageA.length; i++) {
            let link;

            $.ajax({
                    type: "GET",
                    url: pageA[i].href,
                    dataType: "html",
                    async: false,
                })
                .done((data) => {
                    link = $(data).find('#img').attr('src');
                    links.push(link);
                })
                .fail(() => {
                    link = '第 ' + (i + 1) + ' 张图出错;错误地址：' + url;
                    links.push(link);
                });
        }
        return links.length > 0 ? links.join('<br>\n') : '<h1>获取失败</h1>';
    }

    // 设置文本框
    let setTextBox = (text) => {
        if (!document.getElementById('result-box')) {
            let box = document.createElement('div');
            box.setAttribute("contentEditable", true);
            box.id = "result-box";
            $('#gdt').before(box);
        }
        $('#result-box').html(text);
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
                min-width: 720px;
                max-width: 1200px;
                border: 1px solid #000;
                padding: 5px;
                background: #4f535b;
                text-align: center;
                margin: 0 auto 5px auto
            }
        `;

        style.innerHTML = css;

        document.body.appendChild(style);
    }
}