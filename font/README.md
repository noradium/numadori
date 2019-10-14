# 単語リスト
参加する参加済みあなた参加締め切り掛け声で下スライドして上スライドでジャンプ曲に合わせてタップみんなの声完璧に歩けてたちゃんと歩けてた最初よくできてた中盤よくできてた最後よくできてたでも...もう少しがんばろう鳥の行進参加人数人1234567890
ハイレベル
パーフェクト
平凡



## black 64px
```js
Object.keys(Array.from('あなた掛け声で下スライドして上スライドでジャンプ曲に合わせてタップみんなの声鳥の行進参加人数人1234567890 ').reduce((p, c) => {p[c] = true; return p;}, {})).join('')
```
"0123456789あなた掛け声で下スライドして上ジャンプ曲に合わせタッみんの鳥行進参加人数 "
bmpfont-generator --height 64 --chars "0123456789あなた掛け声で下スライドして上ジャンプ曲に合わせタッみんの鳥行進参加人数 " --fill "#0d0015" --json medium_black_64_glyph.json rounded-mplus-1mn-medium.ttf medium_black_64.png

## white 64px
```js
Object.keys(Array.from('参加する参加済み参加締め切り完璧に歩けてたちゃんと歩けてた最初よくできてた中盤よくできてた最後よくできてたでも...もう少しがんばろう').reduce((p, c) => {p[c] = true; return p;}, {})).join('')
```
参加する済み締め切り完璧に歩けてたちゃんと最初よくでき中盤後も.う少しがばろ
bmpfont-generator --height 64 --chars "参加する済み締め切り完璧に歩けてたちゃんと最初よくでき中盤後も.う少しがばろ" --fill "#fff" --json medium_white_64_glyph.json rounded-mplus-1mn-medium.ttf medium_white_64.png

## black 128px
```js
Object.keys(Array.from('鳥の行進').reduce((p, c) => {p[c] = true; return p;}, {})).join('')
```
bmpfont-generator --height 128 --chars "鳥の行進" --fill "#0d0015" --json bold_black_128_glyph.json rounded-mplus-1mn-bold.ttf bold_black_128.png



mv *.png ../image/; mv *.json ../text/;