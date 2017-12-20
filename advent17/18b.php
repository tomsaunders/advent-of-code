#!/usr/bin/env php
<?php
$in = file_get_contents('18.txt');

class Program {
    public $id;
    public $dest;

    private $pos = 0;
    private $registers = [];
    private $lines = [];
    private $queue = [];
    private $isDeadlocked = FALSE;
    public $sentCount = 0;
    

    public function __construct($id, $lines){
        $this->id = $id;
        $this->lines = $lines;

        foreach (str_split('abcdefghijklmnopqrstuvwxyz') as $l) $this->registers[$l] = 0;
        $this->registers['p'] = $id;
    }

    public function exec(){
        if ($pos > count($this->lines)) return;
        $line = $this->lines[$this->pos];
    
        $bits = explode(' ', $line);
        $bits[] = 'ignored';
        list($op, $reg, $val) = $bits;
        
        $rval = is_numeric($reg) ? $reg : $this->registers[$reg];
        if (!is_numeric($val)) $val = $this->registers[$val];
    
        if ($op === 'snd'){
            $this->dest->receive($rval);
            $this->sentCount++;
        } else if ($op === 'set') {
            $this->registers[$reg] = $val;
        } else if ($op === 'add') {
            $this->registers[$reg] += $val;
        } else if ($op === 'mul') {
            $this->registers[$reg] *= $val;
        } else if ($op === 'mod') {
            $this->registers[$reg] %= $val;
        } else if ($op === 'rcv') {
            // if ($rval > 0) {
                if (count($this->queue)){
                    $rec = array_shift($this->queue);
                    $this->registers[$reg] = $rec;
                    $this->isDeadlocked = FALSE;
                } else {
                    $this->isDeadlocked = TRUE;
                    return;
                }
            // }
        } else if ($op === 'jgz') {
            if ($rval > 0) {
                $this->pos += $val;
                return;
            }
        }    
        $this->pos++;
    }

    public function receive($val){
        $this->queue[] = $val;
    }

    public function isRunning(){
        return $this->pos < count($this->lines) && !$this->isDeadlocked;
    }
}

// $in = <<<TST
// snd 1
// snd 2
// snd p
// rcv a
// rcv b
// rcv c
// rcv d
// TST;

$lines = explode("\n", $in);

$a = new Program(0, $lines);
$b = new Program(1, $lines);
$a->dest = $b;
$b->dest = $a;

while ($a->isRunning() || $b->isRunning()){
    $a->exec();
    $b->exec();
}
echo $b->sentCount . PHP_EOL;
// print_r($a);
// print_r($b);