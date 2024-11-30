#!/usr/bin/env php
<?php
$in = file_get_contents('20.txt');
//a
// $in = <<<TST
// p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>
// p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>
// TST;
// //b
// $in = <<<TST
// p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>
// p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>
// p=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>
// p=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>
// TST;

class XYZ {
    public $x;
    public $y;
    public $z;

    public function __construct($x, $y, $z){
        $this->x = $x;
        $this->y = $y;
        $this->z = $z;
    }

    public function distToOrigin(){
        return abs($this->x) + abs($this->y) + abs($this->z);
    }

    public function __toString(){
        return "Pos: {$this->x}, {$this->y}, {$this->z} - dist: " . $this->distToOrigin();
    }
}

class Particle {
    public $id;
    public $p;
    public $v;
    public $a;

    public function __construct($id, $line){
        $this->id = $id;

        $line = str_replace(['p=<', '>', ' v=<', ' a=<', '>', ' '], '', $line);
        list($px, $py, $pz, $vx, $vy, $vz, $ax, $ay, $az) = explode(",", $line);
        $this->p = new XYZ($px, $py, $pz);
        $this->v = new XYZ($vx, $vy, $vz);
        $this->a = new XYZ($ax, $ay, $az);
    }

    public function move(){
        $this->v->x += $this->a->x;
        $this->v->y += $this->a->y;
        $this->v->z += $this->a->z;

        $this->p->x += $this->v->x;
        $this->p->y += $this->v->y;
        $this->p->z += $this->v->z;
    }

    public function dist(){
        return $this->p->distToOrigin();
    }

    public function __toString(){
        return "{$this->id} @ {$this->p}";
    }
}

$particles = [];
$lines = explode("\n", $in);
foreach ($lines as $pno => $line){
    $particles[$pno] = new Particle($pno, $line);
}

$oldC = 1000;
for ($i = 0; $i < 10000; $i++){
    $seen = [];
    $next = $particles;
    for ($p = 0; $p < count($particles); $p++){
        $part = $particles[$p];
        $part->move();
        $key = $part->p . '';

        if (isset($seen[$key])){
            unset($next[$p]);
            unset($next[$seen[$key]]);
        } else {
            $seen[$key] = $p;
        }
    }
    $particles = $next;

    if (count($particles)){
        usort($particles, function($a, $b)
        {
            return $a->dist() - $b->dist();
        });
    }

    $first = reset($particles);
    $d = $first->dist();
    $c = count($particles);
    if ($oldC !== $c) echo "After $i, {$first->id} is closest at $d. $c remaining \n";

    $oldC = $c;
}