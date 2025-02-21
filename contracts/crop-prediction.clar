;; Resource Optimization Contract

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))

(define-map resource-usage
  { farm-id: uint, resource: (string-ascii 32) }
  {
    allocated: uint,
    used: uint,
    last-updated: uint
  }
)

(define-public (allocate-resource (farm-id uint) (resource (string-ascii 32)) (amount uint))
  (let
    ((current-usage (default-to { allocated: u0, used: u0, last-updated: u0 }
                                (map-get? resource-usage { farm-id: farm-id, resource: resource }))))
    (ok (map-set resource-usage
      { farm-id: farm-id, resource: resource }
      {
        allocated: (+ (get allocated current-usage) amount),
        used: (get used current-usage),
        last-updated: block-height
      }
    ))
  )
)

(define-public (record-resource-usage (farm-id uint) (resource (string-ascii 32)) (amount uint))
  (let
    ((current-usage (unwrap! (map-get? resource-usage { farm-id: farm-id, resource: resource }) ERR_NOT_FOUND)))
    (ok (map-set resource-usage
      { farm-id: farm-id, resource: resource }
      {
        allocated: (get allocated current-usage),
        used: (+ (get used current-usage) amount),
        last-updated: block-height
      }
    ))
  )
)

(define-read-only (get-resource-usage (farm-id uint) (resource (string-ascii 32)))
  (map-get? resource-usage { farm-id: farm-id, resource: resource })
)

