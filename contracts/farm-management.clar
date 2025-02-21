;; Farm Management Contract

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))

(define-data-var farm-nonce uint u0)

(define-map farms
  { farm-id: uint }
  {
    owner: principal,
    name: (string-ascii 64),
    location: (string-ascii 128),
    size: uint
  }
)

(define-public (register-farm (name (string-ascii 64)) (location (string-ascii 128)) (size uint))
  (let
    ((farm-id (var-get farm-nonce)))
    (var-set farm-nonce (+ farm-id u1))
    (ok (map-set farms
      { farm-id: farm-id }
      {
        owner: tx-sender,
        name: name,
        location: location,
        size: size
      }
    ))
  )
)

(define-public (update-farm (farm-id uint) (name (string-ascii 64)) (location (string-ascii 128)) (size uint))
  (let
    ((farm (unwrap! (map-get? farms { farm-id: farm-id }) ERR_NOT_FOUND)))
    (asserts! (is-eq tx-sender (get owner farm)) ERR_NOT_AUTHORIZED)
    (ok (map-set farms
      { farm-id: farm-id }
      (merge farm {
        name: name,
        location: location,
        size: size
      })
    ))
  )
)

(define-read-only (get-farm (farm-id uint))
  (map-get? farms { farm-id: farm-id })
)

