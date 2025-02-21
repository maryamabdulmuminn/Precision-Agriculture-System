;; Crop Prediction Contract

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))

(define-map crop-predictions
  { farm-id: uint, crop: (string-ascii 32) }
  {
    predicted-yield: uint,
    optimal-harvest-time: uint,
    last-updated: uint
  }
)

(define-public (update-crop-prediction (farm-id uint) (crop (string-ascii 32)) (predicted-yield uint) (optimal-harvest-time uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set crop-predictions
      { farm-id: farm-id, crop: crop }
      {
        predicted-yield: predicted-yield,
        optimal-harvest-time: optimal-harvest-time,
        last-updated: block-height
      }
    ))
  )
)

(define-read-only (get-crop-prediction (farm-id uint) (crop (string-ascii 32)))
  (map-get? crop-predictions { farm-id: farm-id, crop: crop })
)

