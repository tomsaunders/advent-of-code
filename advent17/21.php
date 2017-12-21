#!/usr/bin/env php
<?php
$in = file_get_contents('21.txt');

// $in = <<<TST
// ../.# => ##./#../...
// .#./..#/### => #..#/..../..../#..#
// TST;

$begin = <<<BEGIN
.#.
..#
###
BEGIN;

define('ONN', '#');

$grid = explode("\n", $begin);

$rules = [];
foreach (explode("\n", $in) as $line){
    list($match, $result) = explode(" => ", $line);
    $rules[$match] = $result;
}

function transpose($a) {
    return call_user_func_array(
        'array_map',
        array(-1 => null) + array_map('array_reverse', $a)
    );
}

function keystr($key){
    $three = array_map(function($a){
        return implode('', $a);
    }, $key);
    return implode('/', $three);
}

function permute($key){
    $size = count($key);

    $keys = [];
    $keys[] = keystr($key);
    $flip = array_map('array_reverse', $key);
    $keys[] = keystr($flip);

    $rotate = transpose($key);
    $keys[] = keystr($rotate);
    $flip = array_map('array_reverse', $rotate);
    $keys[] = keystr($flip);

    $rotate = transpose($rotate);
    $keys[] = keystr($rotate);
    $flip = array_map('array_reverse', $rotate);
    $keys[] = keystr($flip);

    $rotate = transpose($rotate);
    $keys[] = keystr($rotate);
    $flip = array_map('array_reverse', $rotate);
    $keys[] = keystr($flip);

    return $keys;
}

$size = 3;
$nextsize;
$blocks;
$getsize;
$rulesize;

for ($run = 1; $run <= 18; $run++){
    if ($size % 2 === 0){
        $getsize = 2;
        $rulesize = 3;
        $blocks = $size / $getsize;
        $nextsize = $blocks * $rulesize;
    } else if ($size % 3 === 0){
        $getsize = 3;
        $rulesize = 4;
        $blocks = $size / $getsize;
        $nextsize = $blocks * $rulesize;
    }

    $newgrid = [];
    for ($x = 0; $x < $nextsize; $x++){
        $newgrid[$x] = str_pad('', $nextsize, '.');
    }

    for ($x = 0; $x < $blocks; $x++){
        for ($y = 0; $y < $blocks; $y++){
            $key = [];
            for ($a = 0; $a < $getsize; $a++){
                $r = $y * $getsize + $a;
                $bit = [];
                for ($b = 0; $b < $getsize; $b++){
                    $c = $x * $getsize + $b;
                    $bit[] .= $grid[$r][$c];
                }
                $key[] = $bit;
            }
            $keys = permute($key);
            foreach ($keys as $k => $key){
                if (isset($rules[$key])){
                    $found = explode('/', $rules[$key]);

                    for ($a = 0; $a < $rulesize; $a++){
                        $r = $y * $rulesize + $a;
                        for ($b = 0; $b < $rulesize; $b++){
                            $c = $x * $rulesize + $b;
                            $newgrid[$r][$c] = $found[$a][$b];
                        }
                    }
                    break;
                }
            }
        }
    }
    $grid = $newgrid;
    $size = $nextsize;
    $on = 0;
    
    for ($x = 0; $x < $size; $x++){
        for ($y = 0; $y < $size; $y++){
            if ($grid[$x][$y] === ONN) $on++;
        }
    }
    echo "$run : $on\n";
}