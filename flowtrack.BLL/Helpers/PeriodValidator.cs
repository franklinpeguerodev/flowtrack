using flowtrack.BLL.Exceptions;

namespace flowtrack.BLL.Helpers;
public static class PeriodValidator
{
    public static void Validate(int month,int year)
    {
        if(month<1 || month >12)
        {
            throw new BusinessRuleException ("El mes debe estar entre 1 y 12");
        }
        if(year<2000 || year >2100)
        {
            throw new BusinessRuleException ("El año debe estar entre 2000 y 2100");
        }
   
    }
}