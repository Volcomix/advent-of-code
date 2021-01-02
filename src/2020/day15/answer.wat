(module
  (import "js" "memory" (memory 0))
  (func (export "getLastNumber") (param $numberCount i32) (param $maxNumber i32) (result i32)
    (local $i i32)
    (local $lastNumber i32)
    (local $map i32)
    (local.set $map (i32.mul (local.get $numberCount) (i32.const 4)))
    (loop
      (i32.store
        (i32.add
          (local.get $map)
          (local.tee $lastNumber (i32.load (i32.mul (local.get $i) (i32.const 4))))
        )
        (local.get $i)
      )
      (br_if 0 (i32.lt_u
        (local.tee $i (i32.add (local.get $i) (i32.const 1)))
        (local.get $numberCount)
      ))
    )
    local.get $lastNumber
  )
)