#!/usr/bin/env php
<?php

$in = file_get_contents('7.txt');
$tst = <<<TST
pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)
TST;

// $in = $tst;

$lines = explode("\n", $in);

$towers = [];
$allChildren = [];
foreach ($lines as $line){
    $bits = explode(" ", $line);
    list($name, $weight) = $bits;
    $weight = str_replace(['(', ')'], '', $weight);
    $tower = ['weight' => $weight, 'children' => []];
    if (count($bits) > 2){
        list($a, $c) = explode(" -> ", $line);
        $children = explode(", ", $c);
        $tower['children'] = $children;
        $allChildren = array_merge($allChildren, $children);
    }
    $towers[$name] = $tower;
}

$names = array_keys($towers);
$diff = array_diff($names, $allChildren);
$base = reset($diff);

echo "Base $base\n";

class Tower {
    public $name;
    public $weight;
    public $children = [];
    public $childWeights = [];
    public $equalChildren = TRUE;
    public $rightOne = FALSE;
    public $oddOne = FALSE;
    public $treeWeight;

    function __construct($name, $weight){
        $this->name = $name;
        $this->weight = $weight;
    }

    function calc(){
        $kids = [];
        $last = FALSE;
        foreach ($this->children as $child){
            $wgt = $child->getTreeWeight();
            $kids[$child->name] = $wgt;
            if ($last){
                if ($last !== $wgt){
                    $this->equalChildren = FALSE;
                }
            }
            $last = $wgt;
        }
        if (!$this->equalChildren){
            $cnt = [];
            foreach ($kids as $kwgt){
                if (!isset($cnt[$kwgt])) $cnt[$kwgt] = 0;

                $cnt[$kwgt]++;
            }
            
            $odd = FALSE;
            foreach ($cnt as $wgt => $count){
                if ($count === 1) $odd = $wgt;
            }
            foreach ($kids as $name => $wgt){
                if ($wgt === $odd) {
                    $this->oddOne = $this->children[$name];
                } else {
                    $this->rightOne = $this->children[$name];
                }
            }
        }
        $this->treeWeight = $this->getTreeWeight();
    }

    function getTreeWeight(){
        $wgt = $this->weight;
        foreach ($this->children as $child){
            $wgt += $child->getTreeWeight();
        }
        return $wgt;
    }
}

$ts = [];
foreach ($towers as $name => $data){
    $tower = new Tower($name, $data['weight']);
    $ts[$name] = $tower;
}
foreach ($towers as $name => $data){
    $parent = $ts[$name];
    foreach ($data['children'] as $childName){
        $tower = $ts[$childName];
        $parent->children[$childName] = $tower;
    }
}
foreach ($ts as $name => $tower){
    $tower->calc();
}
// print_r($ts[$base]);

echo "Probing $base\n";
function probe($tower){
    $name = $tower->name;
    if (empty($tower->children)){
        echo "UH OH THIS SEEMS WRONG $name\n";
        return;
    }
    $shouldBe = $tower->rightOne->treeWeight;
    $is = $tower->oddOne->treeWeight;
    if ($tower->oddOne->equalChildren){
        echo "The problem is at {$tower->oddOne->name}!!\n";
        $wgt = $tower->oddOne->weight;
        $sb = $wgt + $shouldBe - $is;
        echo "Should be $sb\n";
    } else {
        probe($tower->oddOne);
    }
}
probe($ts[$base]);
