#!/usr/bin/env php
<?php

define('UP', '^');
define('LEFT', '<');
define('RIGHT', '>');
define('DOWN', 'v');

define('TRACKUP', '|');
define('TRACKSIDE', '-');
define('TRACKCROSS', '+');
define('TRACKCURVEA', '/');
define('TRACKCURVEB', '\\');

$turnOrder = ['LEFT', '', 'RIGHT'];

ini_set('memory_limit','4G');
gc_disable();
$in   = file_get_contents('input13.txt');
$test = <<<TST
/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   
TST;
$test2 = <<<TST
/>-<\  
|   |  
| /<+-\
| | | v
\>+</ |
  |   ^
  \<->/
TST;
// $in = $test2;
$lines = explode("\n", $in);

$grid = new grid($lines);

class grid {
	public $grid;
	public $carts;
	public $t = 0;
	public $ok = true;
	public function __construct($grid){
		$this->cart = [];

		foreach($grid as $y => $row){
			for ($x = 0; $x < strlen($row); $x++){
				$c = $grid[$y][$x];
				if ($c == UP || $c == LEFT || $c == RIGHT || $c == DOWN){
					$cart = new cart($x, $y, $c);
					if ($c == UP || $c == DOWN) {
						$grid[$y][$x] = TRACKUP;
					} else {
						$grid[$y][$x] = TRACKSIDE;
					}
					$this->carts[] = $cart;
				}
			}
		}

		$this->grid = $grid;
	}

	public function p(){
		$g = $this->grid;
		foreach ($this->carts as $cart){
			$g[$cart->y][$cart->x] = $cart->orient;
		}
		$g[] = '';
		echo "Time {$this->t}\n";
		echo implode("\n", $g);
	}

	public function tick(){
		$this->t++;
		usort($this->carts, function($a, $b) {
			if ($a->y == $b->y){
				return $a->x - $b->x;
			}
			return $a->y - $b->y;
		});

		$seen = [];
		foreach ($this->carts as $cart){
			$seen[$cart->k()] = $cart;
		}
		foreach ($this->carts as $cart){
			$oldk = $cart->k();
			$cart->move();
			$k = $cart->k();
			if (isset($seen[$k])){
				echo "COLLISION AT $k AT {$this->t}\n\n";
				$this->ok = false;
				$a = $seen[$k];
				$a->dead();
				$cart->dead();
			} else {
				$seen[$k] = $cart;
				unset($seen[$oldk]);
			}
			$c = $this->grid[$cart->y][$cart->x];
			if ($c == TRACKCROSS) {
				$cart->turn();
			} else if ($c == TRACKCURVEA || $c == TRACKCURVEB) {
				$cart->bend($c);
			}
		}
		$this->carts = array_filter($this->carts, function($c){
			return $c->ok;
		});
	}
}

class cart {
	public $x;
	public $y;
	public $orient;
	public $decisions = 0;
	public $left = [
		UP => LEFT,
		LEFT => DOWN,
		DOWN => RIGHT,
		RIGHT => UP
	];
	public $right = [
		UP => RIGHT,
		RIGHT => DOWN,
		DOWN => LEFT,
		LEFT => UP
	];
	public $ok = true;

	public function __construct($x, $y, $orient){
		$this->x = $x;
		$this->y = $y;
		$this->orient = $orient;
	}

	public function dead() {
		$this->ok = false;
	}

	public function k() {
		return "{$this->x},{$this->y}";
	}

	public function turn(){
		if ($this->decisions % 3 == 0){
			// left
			$this->left();
		} else if ($this->decisions % 3 == 1){
			// straight
		} else if ($this->decisions % 3 == 2) {
			// right
			$this->right();
		}
		$this->decisions++;
	}

	public function left() {
		$this->orient = $this->left[$this->orient];
	}

	public function right() {
		$this->orient = $this->right[$this->orient];
	}

	public function bend($type){
		if ($type == TRACKCURVEA){
			if ($this->orient == RIGHT || $this->orient == LEFT){
				$this->left();
			} else {
				$this->right();
			}
		} else {
			if ($this->orient == RIGHT || $this->orient == LEFT){
				$this->right();
			} else {
				$this->left();
			}
		}
	}

	public function move() {
		switch ($this->orient){
			case UP:
				$this->y--;
				break;
			case LEFT:
				$this->x--;
				break;
			case DOWN: 
				$this->y++;
				break;
			case RIGHT:
				$this->x++;
				break;
		}
	}

	public function __toString(){
		return $this->k() . " {$this->orient}";
	}
}

// while ($grid->ok){
// 	$grid->tick();
// }

while (count($grid->carts) > 1){
	$grid->tick();
}
$last = reset($grid->carts);
echo "Last at " . $last->k() . "\n";
// print_r($grid->carts);