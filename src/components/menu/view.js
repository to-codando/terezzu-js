export const menuView = ({ controller, html, css }) => {



	const template = ({ state, props }) => { 
		const items = JSON.parse(props.items)
			return html`
				<div>
					<ul>
						${items.map((item) => html`
							<li onClick=${() => controller.sendItem(item)}>${item}</li>
						`)}
					</ul>
				</div>
			`
	}

	const styles = () => css`
		ctx {
			display: flex;
			justify-content: flex-end;
			width: 100%;
		}
	`

	return { template, styles }
}
