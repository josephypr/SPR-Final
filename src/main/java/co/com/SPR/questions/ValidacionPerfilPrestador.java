package co.com.SPR.questions;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.questions.Visibility;
import static co.com.SPR.userinterface.Campos.BTN_PERFIL_VERIFICAR;


public class ValidacionPerfilPrestador implements Question<Boolean> {

    public static ValidacionPerfilPrestador validacionPerfilPrestador(){return new ValidacionPerfilPrestador();}

    @Override
    public Boolean answeredBy(Actor actor){
        // Obtiene la URL actual del navegador
        String currentUrl = BrowseTheWeb.as(actor).getDriver().getCurrentUrl();
        // Compara con la URL definida en @DefaultUrl de PerfilPrestador
        return currentUrl.contains("/PerfilPrestador");
    }
}
