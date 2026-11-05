namespace flowtrack.BLL.Enums;
public enum BudgetAlertLevel
{
    Normal,
    Warning50,
    Warning80,
    // Excedido: el gasto supera el presupuesto (> 100%).
    Exceeded,
    // Al límite: el gasto es igual al presupuesto (exactamente 100%).
    // Se agrega al final para no alterar los valores ya existentes.
    Warning100
}
