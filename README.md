# Kit-AutProxy
## 概要
金沢工業大学のWi-Fiを利用して開発をしていると
- プロキシが邪魔をしてgitコマンドが打てない！！
- もしくはいちいちコマンドを打って設定を変えないといけない！！<br>
なんてことがあってダルいんです。<br>
なので自動的にIPアドレスを解析してプロキシを設定・解除してくれるシステムを作ってみました。

## 使い方
**Zshがインストールされていることを前提としています**
```open ~/.zshrc ```で.zshcrファイルを開く
```
function setproxy(){
    echo "set proxy"
    export http_proxy=http://wwwproxy.kanazawa-it.ac.jp:8080/
	export https_proxy=http://wwwproxy.kanazawa-it.ac.jp:8080/
}

function unsetproxy(){
    echo "unset proxy"
    export http_proxy=
	export https_proxy=
}


function autoproxy(){
	#node以降はproxy.jsがあるパスを書く
    if node ~/bin/proxy.js; then setproxy;else unsetproxy; fi
}

autoproxy
```
これで出来るはず！！
