#!/usr/bin/env php
<?php

$in = file_get_contents('9.txt');
$tst = <<<TST
{}
{{{}}}
{{},{}}
{{{},{},{{}}}}
{<a>,<a>,<a>,<a>}
{{<ab>},{<ab>},{<ab>},{<ab>}}
{{<!!>},{<!!>},{<!!>},{<!!>}}
{{<a!>},{<a!>},{<a!>},{<ab>}}
<>
<random characters>
<<<<>
<{!>}>
<!!>
<!!!>>
<{o"i!a,<{i<a>
TST;

// $in = $tst;

$lines = explode("\n", $in);

function getScore($line){
    $len= strlen($line);
    $depth = 0;
    $score = 0;
    $garbage = FALSE;
    $removed = 0;

    for ($i = 0; $i < $len; $i++){
        $c = $line[$i];
        if ($garbage){
            if ($c === "!") {
                $i++;
            } else if ($c === ">"){
                $garbage = FALSE;
            } else {
                $rem++;
            }
        } else {
            if ($c === "<") {
                $garbage = TRUE;
            } else if ($c === "{"){
                $depth++;
                $score += $depth;
            } else if ($c === "}"){
                $depth--;
            }
        }
    }

    return [$score, $rem];
}

$total = 0;
$removed = 0;
foreach ($lines as $line){
    list($score, $rem) = getScore($line);
    // echo "$line $score $rem\n";
    $total += $score;
    $removed += $rem;
}
echo "$total\n";
echo "$removed\n";