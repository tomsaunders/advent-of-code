#!/usr/bin/env php
<?php
ini_set('memory_limit', '2G');
$in = file_get_contents('24.txt');

// $in = <<<TST
// 0/2
// 2/2
// 2/3
// 3/4
// 3/5
// 0/1
// 10/1
// 9/10
// TST;

global $found;
$found = [];
global $components;
$components = []; for ($i = 0; $i <= 50; $i++) $components[$i] = [];
$lines = explode("\n", $in);
global $index;
$index = [];
foreach ($lines as $id => $line){
    list($a, $b) = explode("/", $line);
    $c = new Component($id, $a, $b);
    $components[$a][] = $c;
    $components[$b][] = $c;
    $index[$id] = $c;
}
class Component {
    public $id; public $left; public $right; public $total; public function __construct($id, $a, $b) { $this->id = $id; $this->left = $a; $this->right = $b; $this->total = $a + $b;} 
    public function __toString(){
        return $this->left . "/" . $this->right;
    }
}

$last = 0;
pathFind([], $last);

function pathFind($path, $last){
    // print_r($path);
    

    global $index;
    global $components;
    global $found;

    // echo "seeking from $last\n";
    $set = array_diff($components[$last], $path);
    // echo implode(';;', $set) . PHP_EOL;
    if (count($set) === 0){
        $found[] = $path;
        return;
    }

    foreach ($set as $component){
        $next = ($component->left == $last) ? $component->right : $component->left;
        pathFind(array_merge($path, [$component]), $next);
        // echo "trying next $next\n";
        // echo implode(';;', array_merge($path, [$component])) . PHP_EOL;
    }
}
// echo "\nfound\n";
// print_r($found);
echo max(array_map(function($path){
    return array_sum(array_map(function($component){
        return $component->total;
    }, $path));
}, $found)) . PHP_EOL;


// b
$idx = [];
foreach ($found as $path){
    $c = count($path);
    if (!isset($idx[$c])) $idx[$c] = [];

    $idx[$c][] = $path;
}

$longest = max(array_keys($idx));
foreach ($idx[$longest] as $path){
    echo "long path: " . array_sum(array_map(function($component){
        return $component->total;
    }, $path)) . PHP_EOL;
}