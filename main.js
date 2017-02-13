let main = () => {
    // 启动按钮
    $(document).ready(function() {
        // 在页面中插入一个执行按钮
        setBtn();

        // 点击按钮执行操作
        $('#list-btn').click(function() {
            mainTask();
        });

    });

    // 主要操作逻辑
    let mainTask = () => {
        // 1. 获取链接
        const text = getImgLinks();
        // 2. 正文文字插入到一个 div 中，等待复制
        setTextBox(text);
    }

    // 设置按钮
    let setBtn = () => {

        const btnElm = `
        <tr>
            <td class="tc">获取链接:</td>
            <td><button type="button" id="list-btn">点击获取</button></td>
        </tr>
        `;

        const btnCss = {
            borderRadius: "5px",
            border: "1px solid #989898",
            padding: "1px 4px",
            cursor: "pointer",
            color: "#ddd",
            background: "transparent",
            fontWeight: "700"
        };

        $('#taglist').find('tbody').append(btnElm);

        $('#list-btn').css(btnCss);

        $('#list-btn').hover(function() {
            // over
            $(this).css('color', '#FFFBDB');
        }, function() {
            // out
            $(this).css('color', '#ddd');
        });

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
                success: (data) => {
                    link = $(data).find('#img').attr('src');
                    links.push(link);
                },
                error: () => {
                    link = '第 ' + (i + 1) + ' 张图出错;错误地址：' + url;
                    links.push(link);
                }
            })
        }
        return links.length > 0 ? links.join('<br>\n') : '<h1>获取失败</h1>';
    }

    // 设置文本框
    let setTextBox = (text) => {
        let box = document.createElement('div');
        const boxCss = {
            minWidth: '720px',
            maxWidth: '1200px',
            border: '1px solid #000',
            padding: '5px',
            background: '#4f535b',
            textAlign: 'center',
            margin: '0 auto 5px auto'
        }
        box.setAttribute("contentEditable", true);
        box.id = "result-box";
        $(box).css(boxCss);
        if (!document.getElementById('result-box')) {
            $('#gdt').before(box);
        }
        box.innerHTML = text;
    }
}