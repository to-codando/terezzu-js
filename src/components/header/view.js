export const headerView = ({ controller, html, css }) => {

	const template = ({ props, state }) => { 

		 return html`
				<div>
					<h3>${state.item}</h3>

					<nav
						data-component="menu"
						data-items=${props.items}
					></nav>
				</div>
			`
	}

	const styles = () => css`
		ctx {
			display: flex;
			width: 100%;
		}

		h1 {
			display: flex;
			justify-content: flex-start;	
			align-items: center;
			color: red;
			padding: 1rem 2rem;
			border: 5px dotted red;
		}


	`

	return { template, styles }
}
