;; Sensor Data Contract

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))

(define-data-var data-nonce uint u0)

(define-map sensor-data
  { data-id: uint }
  {
    farm-id: uint,
    sensor-type: (string-ascii 32),
    value: int,
    timestamp: uint
  }
)

(define-public (record-sensor-data (farm-id uint) (sensor-type (string-ascii 32)) (value int))
  (let
    ((data-id (var-get data-nonce)))
    (var-set data-nonce (+ data-id u1))
    (ok (map-set sensor-data
      { data-id: data-id }
      {
        farm-id: farm-id,
        sensor-type: sensor-type,
        value: value,
        timestamp: block-height
      }
    ))
  )
)

(define-read-only (get-sensor-data (data-id uint))
  (map-get? sensor-data { data-id: data-id })
)

