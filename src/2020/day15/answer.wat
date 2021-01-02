(module

  (import "js" "memory" (memory 0))
  ;; 0 ----------------- $numberCount * 4 ------------------- $maxNumber * 4
  ;; |     Starting numbers     |     Map of last turn by number     |
  ;; -----------------------------------------------------------------
  ;; Each i32 takes 4 bytes so we have multplications by 4 at several places

  (func (export "getLastNumber") (param $numberCount i32) (param $maxNumber i32) (result i32)

    (local $lastTurns i32) ;; Address of the map of last turns by number in memory
    (local $lastTurn i32) ;; Last turn a number was spoken
    (local $turn i32) ;; Turn number
    (local $lastNumber i32) ;; Last number spoken
    (local $lastNumberAddress i32) ;; Address of the last number in the map

    ;; Set the address of the first element of the map
    (local.set $lastTurns (i32.mul (local.get $numberCount) (i32.const 4)))

    (local.set $turn (i32.const 1))

    ;; Fill last turn of starting numbers
    (loop
      (i32.store
        (i32.add
          (local.get $lastTurns)
          (i32.mul
            ;; Load starting number
            (i32.load (i32.mul (i32.sub (local.get $turn) (i32.const 1)) (i32.const 4)))
            (i32.const 4)
          )
        )
        (local.get $turn)
      )
      (br_if 0 (i32.le_u
        (local.tee $turn (i32.add (local.get $turn) (i32.const 1)))
        (local.get $numberCount)
      ))
    )

    ;; Compute numbers spoken
    (loop
      (local.set $lastTurn
        (i32.load (local.tee $lastNumberAddress
          (i32.add
            (local.get $lastTurns)
            (i32.mul (local.get $lastNumber) (i32.const 4))
          )
        ))
      )
      (i32.store (local.get $lastNumberAddress) (local.get $turn))
      (local.set $lastNumber
        (select
          (i32.sub (local.get $turn) (local.get $lastTurn))
          (i32.const 0)
          (local.get $lastTurn)
        )
      )
      (br_if 0 (i32.lt_u
        (local.tee $turn (i32.add (local.get $turn) (i32.const 1)))
        (local.get $maxNumber)
      ))
    )

    local.get $lastNumber
  )
)