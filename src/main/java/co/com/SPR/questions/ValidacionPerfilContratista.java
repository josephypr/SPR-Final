package co.com.SPR.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;

public class ValidacionPerfilContratista implements Question<Boolean> {
    public static ValidacionPerfilContratista validacionPerfilContratista(){return new ValidacionPerfilContratista();}

    @Override
    public Boolean answeredBy(Actor actor){
        // Obtiene la URL actual del navegador
        String currentUrl = BrowseTheWeb.as(actor).getDriver().getCurrentUrl();
        // Compara con la URL definida en @DefaultUrl de PerfilPrestador
        return currentUrl.contains("/PerfilContratista");
    }
}
