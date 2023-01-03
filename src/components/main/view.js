export const mainView = ({ controller, html, css }) => {

	const template = ({ state }) => {
		const menuList = JSON.stringify(state.menuList)
		
		 return html`
				<div>
					<div
						data-component="header"
						data-items="${menuList}"
					>
					</div>

					<h1 onClick=${controller.setState}>${state.text}</h1>
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
