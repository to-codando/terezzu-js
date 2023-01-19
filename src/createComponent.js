export const createComponent = ({ model, view, controller }) => {
  const type = 'component'
  return (state) => ({
    type,
    state,
    model,
    view,
    controller
  })
}
