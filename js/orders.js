orderCard.innerHTML = `

    <div class="order-card-header">
        ...
    </div>

    ${
        status === "Delivered"
            ? `
                <span class="delivered-message">
                    ✓ Delivered
                </span>
              `
            : ""
    }

`;