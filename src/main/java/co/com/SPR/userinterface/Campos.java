package co.com.SPR.userinterface;
import net.serenitybdd.screenplay.targets.Target;
import org.apache.poi.ss.formula.functions.T;
import org.openqa.selenium.By;



public class Campos {

    public static Target BTN_USUARIO = Target.the("boton usuario").located(By.xpath("//*[@id=\"root\"]/div/header/div/span"));
    public static final Target BTN_USUARIO_VERIFICAR = Target.the("boton usuario").located(By.xpath("//*[@id=\"root\"]/div/header/div/span"));
    public static Target BTN_PERFIL = Target.the("boton perfil").located(By.xpath("//*[@id=\"root\"]/div/header/div/div/button[1]"));
    public static Target BTN_ELIMINAR = Target.the( "eliminar cuenta").located(By.xpath("//*[@id=\"root\"]/div/form/div[8]/button[3]"));
    public static Target BTN_CERRAR_SESION = Target.the("cerrar sesion").located(By.xpath("//*[@id=\"root\"]/div/header/div/div/button[2]"));

    public static Target BTN_EDITAR_PERFIL = Target.the("editar perfil").located(By.xpath("//*[@id=\"root\"]/div/form/div[8]/button[1]"));
    public static Target INPUT_TELEFONO = Target.the("telefono").located(By.xpath("//*[@id=\"root\"]/div/form/div[5]/input"));
    public static Target BTN_GUARDAR = Target.the("guardar").located(By.xpath("//*[@id=\"root\"]/div/form/div[8]/button[1]"));

    public static Target BTN_PRESTADORES = Target.the("prestadores servicio").located(By.xpath("//*[@id=\"root\"]/div/main/section/div/div[1]/button"));
    public static Target BTN_POSTULARSE = Target.the("postulacion servicio").located(By.xpath("//*[@id=\"root\"]/div/main/section/button"));

    public static Target BTN_ELIMINARPOSTULACION = Target.the("eliminar postulacion de servicio").located(By.xpath("//*[@id=\"root\"]/div/main/section/div/button"));
}

