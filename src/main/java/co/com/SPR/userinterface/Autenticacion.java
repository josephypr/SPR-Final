package co.com.SPR.userinterface;
import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;
public class Autenticacion {

    public static Target INPUT_ROL = Target.the(" Seleccionar Rol").located(By.xpath("//*[@id=\"root\"]/div/div/form/select"));
    public static Target INPUT_CORREO = Target.the("Nombre").located(By.xpath("//*[@id=\"root\"]/div/div/form/input[1]"));
    public static Target INPUT_CONTRASENA = Target.the( "Contrasena").located(By.xpath("//*[@id=\"root\"]/div/div/form/input[2]"));
    public static Target BTN_INICIOSESION = Target.the( "iniciar sesion").located(By.xpath("//*[@id=\"root\"]/div/div/form/div/button[1]"));

}

