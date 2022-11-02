using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string RetrieveEmailFromPrincipal(this ClaimsPrincipal user)
        {
            // return user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value; // ders 216 dk:7 videoda bu kodu yazıyor fakat
            return user.FindFirstValue(ClaimTypes.Email); // bu şekilde de kullanabileceğimizi öneriyor
        }
    }
}