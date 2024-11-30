#!/usr/bin/env php
<?php
ini_set('memory_limit','4G');
$in   = file_get_contents('input9.txt');
$test = <<<TST

TST;

$in   = '419 players; last marble is worth 72164 points';
$in   = [[419, 72164]];
$tsts = [
	[9, 25],
	[10, 1618],
	[13, 7999],
	[17, 1104],
	[21, 6111],
	[30, 5807],
];
$tsts[] = $in[0];
$tsts[] = [419, 7216400];

gc_disable();

class node {
	public $v;
	public $nextNode;
	public $prevNode;

	public function __construct($value) {
		$this->v = $value;
	}

	public function prev() {
		return $this->prevNode;
	}

	public function add($value) {
		$node = new node($value);
		$tmp  = $this->nextNode;

		$tmp->prevNode  = $node;
		$node->prevNode = $this;
		$node->nextNode = $tmp;
		$this->nextNode = $node;
		return $node;
	}

	public function remove() {
		$this->nextNode->prevNode = $this->prevNode;
		$this->prevNode->nextNode = $this->nextNode;
		$tmp = $this->nextNode;

		$this->prevNode = $this->nextNode = null;
		return $tmp;
	}

	public function circle() {
		$out = $this->v;
		$t   = $this->next();
		while ($t !== $this) {
			$out .= "," . $t->v;
			$t   = $t->next();
		}
		return $out;
	}

	public function next() {
		return $this->nextNode;
	}
}

foreach ($tsts as $t) {
	list($playerCount, $last) = $t;

	$players           = array_pad([], $playerCount, 0);
	$p                 = 0;
	$current           = new node(0);
	$current->prevNode = $current->nextNode = $current;
	$circle            = $current;

	for ($m = 1; $m <= $last; $m++) {
		if ($m % 23 === 0) {
			$players[$p] += $m;
			$remove      = $current->prev()->prev()->prev()->prev()->prev()->prev()->prev();
			$players[$p] += $remove->v;
			$current     = $remove->remove();
		} else {
			$current = $current->next()->add($m);
		}

		$p++;
		if ($p == $playerCount) {
			$p = 0;
		}
//		echo "circle is now " . $circle->circle() . PHP_EOL;
	}
	$highest = max($players);
	$highp   = array_search($highest, $players);
	echo "players $playerCount winner $highp last $last Highest score $highest\n";
}