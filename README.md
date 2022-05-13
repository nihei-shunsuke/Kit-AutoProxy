# Kit-AutProxy
## 概要
- 金沢工業大学のWi-Fiを利用して開発をしていると
- プロキシが邪魔をしてgitコマンドが打てない！！
- もしくはいちいちコマンドを打って設定を変えないといけない！！
なんてことがあってダルいんです。
なので自動的にIPアドレスを解析してプロキシを設定・解除してくれるシステムを作ってみました。

## 使い方
-　**Zshがインストールされていることを前提としています**
```open ~/.zshrc ```で.zshcrファイルを開く
```
function setproxy(){
    echo "set Proxt"
    git config --global http.proxy http://wwwproxy.kanazawa-it.ac.jp:8080/
    git config --global https.proxy http://wwwproxy.kanazawa-it.ac.jp:8080/
    npm config --global set proxy http://wwwproxy.kanazawa-it.ac.jp:8080/
    npm config --global set https-proxy http://wwwproxy.kanazawa-it.ac.jp:8080/
}

function deleteproxy(){
    echo "delete Proxt"
    git config --global --unset http.proxy http://wwwproxy.kanazawa-it.ac.jp:8080/
    git config --global --unset https.proxy http://wwwproxy.kanazawa-it.ac.jp:8080/
    npm config -g delete proxy
    npm config -g delete https-proxy
}
function statusproxy(){
    git config --global https.proxy
}

function autoproxy(){
	#node以降はproxy.jsがあるパスを書く
    if node ~/bin/proxy.js; then setproxy;else deleteproxy; fi
}

autoproxy
```
これで出来るはず！！
